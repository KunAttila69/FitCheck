using FitCheck_Server.Data;
using FitCheck_Server.DTOs;
using FitCheck_Server.Models;
using FitCheck_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/follow")]
    [Authorize]
    public class FollowController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly NotificationService _notificationService;

        public FollowController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager, NotificationService notificationService)
        {
            _context = context;
            _userManager = userManager;
            _notificationService = notificationService;
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> FollowUser(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (currentUserId == userId)
                return BadRequest(new { Message = "You cannot follow yourself" });

            var userToFollow = await _userManager.FindByIdAsync(userId);
            if (userToFollow == null)
                return NotFound(new { Message = "User not found" });

            var existingFollow = await _context.UserFollowers
                .FirstOrDefaultAsync(uf => uf.FollowerId == currentUserId && uf.FollowedId == userId);

            if (existingFollow != null)
                return BadRequest(new { Message = "You are already following this user" });

            var userFollow = new UserFollower
            {
                FollowerId = currentUserId,
                FollowedId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserFollowers.Add(userFollow);
            await _context.SaveChangesAsync();

            await _notificationService.CreateFollowNotificationAsync(currentUserId,userId);

            return Ok(new { message = "Successfully followed user" });
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> UnfollowUser(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var follow = await _context.UserFollowers
                .FirstOrDefaultAsync(uf => uf.FollowerId == currentUserId && uf.FollowedId == userId);

            if (follow == null)
                return NotFound(new { Message = "You are not following this user" });

            _context.UserFollowers.Remove(follow);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("followers")]
        public async Task<IActionResult> GetFollowers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var followers = await _context.UserFollowers
                .Include(uf => uf.Follower)
                .Where(uf => uf.FollowedId == currentUserId)
                .OrderByDescending(uf => uf.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(uf => new FollowerDto
                {
                    UserId = uf.FollowerId,
                    Username = uf.Follower.UserName,
                    ProfilePictureUrl = uf.Follower.ProfilePictureUrl,
                    FollowedSince = uf.CreatedAt
                })
                .ToListAsync();

            return Ok(followers);
        }

        [HttpGet("following")]
        public async Task<IActionResult> GetFollowing([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var following = await _context.UserFollowers
                .Include(uf => uf.Followed)
                .Where(uf => uf.FollowerId == currentUserId)
                .OrderByDescending(uf => uf.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(uf => new FollowerDto
                {
                    UserId = uf.FollowedId,
                    Username = uf.Followed.UserName,
                    ProfilePictureUrl = uf.Followed.ProfilePictureUrl,
                    FollowedSince = uf.CreatedAt
                })
                .ToListAsync();

            return Ok(following);
        }

        [HttpGet("stats/{userId?}")]
        public async Task<IActionResult> GetFollowStats(string userId = null)
        {
            var targetUserId = userId ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.FindByIdAsync(targetUserId);
            if (user == null)
                return NotFound(new { Message = "User not found" });

            var followersCount = await _context.UserFollowers
                .CountAsync(uf => uf.FollowedId == targetUserId);

            var followingCount = await _context.UserFollowers
                .CountAsync(uf => uf.FollowerId == targetUserId);

            return Ok(new FollowStats
            {
                FollowersCount = followersCount,
                FollowingCount = followingCount
            });
        }

        [HttpGet("check/{userId}")]
        public async Task<IActionResult> CheckFollowStatus(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isFollowing = await _context.UserFollowers
                .AnyAsync(uf => uf.FollowerId == currentUserId && uf.FollowedId == userId);

            return Ok(new { isFollowing });
        }
    }
}