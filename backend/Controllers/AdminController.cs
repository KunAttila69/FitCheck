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
                    Roles = roles
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
                return BadRequest("Failed to assign role to user");
            }

            return Ok($"Role {request.RoleName} assigned to user successfully");
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
                return BadRequest("Failed to remove role from user");
            }

            return Ok($"Role {request.RoleName} removed from user successfully");
        }

        [HttpGet("user-roles/{userId}")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var roles = await _roleService.GetUserRolesAsync(userId);
            return Ok(new { Roles = roles });
        }
    }
}