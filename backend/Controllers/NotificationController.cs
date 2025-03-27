using FitCheck_Server.Data;
using FitCheck_Server.DTOs;
using FitCheck_Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationsController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var notifications = await _context.Notifications
                .Include(n => n.Actor)
                .Include(n => n.Post)
                    .ThenInclude(p => p.MediaFiles.Take(1))
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    ActorUsername = n.Actor.UserName,
                    ActorProfilePictureUrl = n.Actor.ProfilePictureUrl,
                    Type = n.Type,
                    PostId = n.PostId,
                    PostThumbnailUrl = n.Post != null && n.Post.MediaFiles.Any() ?
                        n.Post.MediaFiles.First().FilePath : null,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead
                })
                .ToListAsync();

            // Get unread count
            var unreadCount = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);

            return Ok(new
            {
                Notifications = notifications,
                UnreadCount = unreadCount,
                TotalCount = await _context.Notifications.CountAsync(n => n.UserId == userId)
            });
        }

        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] MarkNotificationsReadDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            IQueryable<Notification> query = _context.Notifications.Where(n => n.UserId == userId);

            if (dto.NotificationIds != null && dto.NotificationIds.Any())
            {
                query = query.Where(n => dto.NotificationIds.Contains(n.Id));
            }
            else if (dto.MarkAll)
            {
                // Mark all as read
            }
            else
            {
                return BadRequest("Either provide notificationIds or set markAll to true");
            }

            var notifications = await query.ToListAsync();
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }

    public class MarkNotificationsReadDto
    {
        public List<int> NotificationIds { get; set; } = new List<int>();
        public bool MarkAll { get; set; } = false;
    }
}