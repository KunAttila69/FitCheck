using FitCheck_Server.Data;
using FitCheck_Server.DTOs;
using FitCheck_Server.Models;
using FitCheck_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FileService _fileService;
        private readonly ApplicationDbContext _context;

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            FileService fileService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _fileService = fileService;
            _context = context;
        }

        #region Profile Endpoints
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            return Ok(new ProfileDto
            {
                Username = user.UserName,
                Email = user.Email,
                Bio = user.Bio,
                ProfilePictureUrl = user.ProfilePictureUrl,
                JoinedAt = user.CreatedAt
            });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            if (dto.Username != null && _userManager.Users.Any(u => u.UserName == dto.Username)) return BadRequest(new { Message = "The given username is already in use." });
            
            // Update properties
            user.UserName = dto.Username ?? user.UserName;
            user.Email = dto.Email ?? user.Email;
            user.Bio = dto.Bio ?? user.Bio;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Profile updated");
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetUserProfile(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("User not found");

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var followersCount = await _context.UserFollowers
                .CountAsync(uf => uf.FollowedId == user.Id);

            var followingCount = await _context.UserFollowers
                .CountAsync(uf => uf.FollowerId == user.Id);

            bool isFollowing = false;
            if (currentUserId != null)
            {
                isFollowing = await _context.UserFollowers
                    .AnyAsync(uf => uf.FollowerId == currentUserId && uf.FollowedId == user.Id);
            }

            return Ok(new
            {
                Username = user.UserName,
                Email = user.Email,
                Bio = user.Bio,
                ProfilePictureUrl = user.ProfilePictureUrl,
                JoinedAt = user.CreatedAt,
                FollowersCount = followersCount,
                FollowingCount = followingCount,
                IsFollowing = isFollowing
            });
        }
        #endregion

        #region Password Management
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            var result = await _userManager.ChangePasswordAsync(
                user,
                dto.CurrentPassword,
                dto.NewPassword
            );

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }
        #endregion

        #region Avatar Management
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Save the avatar
            var avatarPath = await _fileService.SaveAvatarAsync(file);
            user.ProfilePictureUrl = avatarPath;

            await _userManager.UpdateAsync(user);

            return Ok(new { ProfilePictureUrl = avatarPath });
        }
        #endregion
    }

    #region DTOs
    public class ProfileDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? Username { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? Bio { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
    #endregion
}