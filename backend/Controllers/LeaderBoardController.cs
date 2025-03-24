using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitCheck_Server.Data;
using FitCheck_Server.DTOs;
using FitCheck_Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/leaderboard")]
    [Authorize]
    public class LeaderboardController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public LeaderboardController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get the total number of likes for each user by joining the Posts and Likes tables
            var userLikeCounts = await _dbContext.Users
                .Select(u => new
                {
                    UserId = u.Id,
                    Username = u.UserName,
                    ProfilePictureUrl = u.ProfilePictureUrl,
                    LikeCount = u.Id == null ? 0 : _dbContext.Posts
                        .Where(p => p.UserId == u.Id)
                        .SelectMany(p => p.Likes)
                        .Count()
                })
                .OrderByDescending(ul => ul.LikeCount)
                .ToListAsync();

            int currentUserRank = 0;
            for (int i = 0; i < userLikeCounts.Count; i++)
            {
                if (userLikeCounts[i].UserId == currentUserId)
                {
                    currentUserRank = i + 1;
                    break;
                }
            }

            var top100Users = userLikeCounts.Take(100)
                .Select((u, index) => new UserRankDto
                {
                    Rank = index + 1,
                    UserId = u.UserId,
                    Username = u.Username,
                    ProfilePictureUrl = u.ProfilePictureUrl,
                    LikeCount = u.LikeCount
                })
                .ToList();

            // Add the current user's rank if they're not in the top 100
            UserRankDto currentUserRankData = null;
            var currentUser = userLikeCounts.FirstOrDefault(u => u.UserId == currentUserId);
            if (currentUser != null)
            {
                currentUserRankData = new UserRankDto
                {
                    Rank = currentUserRank,
                    UserId = currentUser.UserId,
                    Username = currentUser.Username,
                    ProfilePictureUrl = currentUser.ProfilePictureUrl,
                    LikeCount = currentUser.LikeCount
                };
            }

            return Ok(new LeaderboardResponseDto
            {
                TopUsers = top100Users,
                CurrentUserRank = currentUserRankData
            });
        }
    }
}