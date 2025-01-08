using FitCheck_Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly MySqlConnection _connection;

        public AuthController(IConfiguration config, MySqlConnection connection)
        {
            _config = config;
            _connection = connection;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username and password are required.");
            }

            try
            {
                await _connection.OpenAsync();

                // Check if the user exists and get the password hash
                var query = "SELECT password_hash FROM users WHERE username = @username";
                using var cmd = new MySqlCommand(query, _connection);
                cmd.Parameters.AddWithValue("@username", request.Username);

                var storedPasswordHash = await cmd.ExecuteScalarAsync() as string;

                // Validate credentials
                if (storedPasswordHash == null || !VerifyPasswordHash(request.Password, storedPasswordHash))
                {
                    return Unauthorized("Invalid credentials.");
                }

                // Generate JWT token
                var token = GenerateJwtToken(request.Username);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                await _connection.CloseAsync();
            }
        }

        private string GenerateJwtToken(string username)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "User")
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(int.Parse(_config["Jwt:ExpiryMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var computedHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return storedHash == computedHash;
        }
    }
}
