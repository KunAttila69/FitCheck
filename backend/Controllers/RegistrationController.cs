using FitCheck_Server.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Security.Cryptography;
using System.Text;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly MySqlConnection _connection;

        public RegistrationController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username and password are required.");
            }

            try
            {
                await _connection.OpenAsync();
                
                // Check if the username already exists
                var checkCmd = new MySqlCommand("SELECT COUNT(*) FROM users WHERE username = @username", _connection);
                checkCmd.Parameters.AddWithValue("@username", request.Username);
                var userExists = Convert.ToInt32(await checkCmd.ExecuteScalarAsync()) > 0;

                if (userExists)
                {
                    return Conflict("Username already exists.");
                }

                // Hash the password
                var passwordHash = HashPassword(request.Password);

                // Insert the new user
                var insertCmd = new MySqlCommand(
                    "INSERT INTO users (username, password_hash) VALUES (@username, @password_hash)",
                    _connection
                );
                insertCmd.Parameters.AddWithValue("@username", request.Username);
                insertCmd.Parameters.AddWithValue("@password_hash", passwordHash);

                await insertCmd.ExecuteNonQueryAsync();

                return Ok("User registered successfully.");
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}