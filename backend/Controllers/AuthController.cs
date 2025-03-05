using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitCheck_Server.Models;
using FitCheck_Server.Services;
using FitCheck_Server.DTOs;
using FitCheck_Server.Data;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AuthService _authService;
        private readonly ApplicationDbContext _dbContext;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            AuthService authService,
            ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _authService = authService;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ApplicationUser? existingUser = await _userManager.FindByNameAsync(request.Username);
            if (existingUser != null)
            {
                return BadRequest(new { Message = "Username is already taken." });
            }

            existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest(new { Message = "Email is already in use." });
            }

            ApplicationUser? user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow

            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ApplicationUser? user = await _userManager.FindByNameAsync(request.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            string accessToken = _authService.GenerateAccessToken(user);
            string refreshToken = _authService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); 
            await _userManager.UpdateAsync(user); 

            return Ok(new { accessToken, refreshToken });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshRequest request)
        {
            ApplicationUser? user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Invalid or expired refresh token" });
            }

            string newAccessToken = _authService.GenerateAccessToken(user);
            string newRefreshToken = _authService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(1);
            await _userManager.UpdateAsync(user);

            return Ok(new { accessToken = newAccessToken, refreshToken = newRefreshToken });
        }
    }
}