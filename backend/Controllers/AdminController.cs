using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FitCheck_Server.Models;
using FitCheck_Server.Services;
using FitCheck_Server.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Policy = "RequireAdministratorRole")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleService _roleService;

        public AdminController(UserManager<ApplicationUser> userManager, RoleService roleService)
        {
            _userManager = userManager;
            _roleService = roleService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var userDetails = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userDetails.Add(new
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Roles = roles,
                    CreatedAt = user.CreatedAt,
                    IsBanned = user.IsBanned,
                    BanReason = user.BanReason,
                    BannedAt = user.BannedAt,
                    Bio = user.Bio,
                    ProfilePictureUrl = user.ProfilePictureUrl
                });
            }

            return Ok(userDetails);
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _roleService.AssignRoleToUserAsync(request.UserId, request.RoleName);
            if (!result)
            {
                return BadRequest(new { Message = "Failed to assign role to user" });
            }

            return Ok(new { Message = $"Role {request.RoleName} assigned to user successfully" });
        }

        [HttpPost("remove-role")]
        public async Task<IActionResult> RemoveRole([FromBody] UserRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _roleService.RemoveRoleFromUserAsync(request.UserId, request.RoleName);
            if (!result)
            {
                return BadRequest(new { Message = "Failed to remove role from user" });
            }

            return Ok(new { Message = $"Role {request.RoleName} removed from user successfully" });
        }

        [HttpGet("user-roles/{userId}")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var roles = await _roleService.GetUserRolesAsync(userId);
            return Ok(new { Roles = roles });
        }

        [HttpPost("ban-user")]
        public async Task<IActionResult> BanUser([FromBody] UserBanRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if trying to ban self
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == request.UserId)
            {
                return BadRequest(new { Message = "You cannot ban yourself" });
            }

            // Check if user exists and is not an administrator
            var userToBan = await _userManager.FindByIdAsync(request.UserId);
            if (userToBan == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            if (await _userManager.IsInRoleAsync(userToBan, "Administrator"))
            {
                return BadRequest(new { Message = "Cannot ban an administrator" });
            }

            var result = await _roleService.BanUserAsync(request.UserId, request.Reason);
            if (!result)
            {
                return BadRequest(new { Message = "Failed to ban user" });
            }

            return Ok(new { Message = "User banned successfully" });
        }

        [HttpPost("unban-user/{userId}")]
        public async Task<IActionResult> UnbanUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { Message = "User ID is required" });
            }

            var userToUnban = await _userManager.FindByIdAsync(userId);
            if (userToUnban == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            if (!userToUnban.IsBanned)
            {
                return BadRequest(new { Message = "User is not banned" });
            }

            var result = await _roleService.UnbanUserAsync(userId);
            if (!result)
            {
                return BadRequest(new { Message = "Failed to unban user" });
            }

            return Ok(new { Message = "User unbanned successfully" });
        }

        [HttpGet("banned-status/{userId}")]
        public async Task<IActionResult> GetBannedStatus(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            return Ok(new
            {
                IsBanned = user.IsBanned,
                BanReason = user.BanReason,
                BannedAt = user.BannedAt
            });
        }
    }
}