using FitCheck_Server.Data;
using FitCheck_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace FitCheck_Server.Services
{
    public class NotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateLikeNotificationAsync(string actorId, int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null || post.UserId == actorId) return; // Don't notify if post doesn't exist or user likes their own post

            var notification = new Notification
            {
                UserId = post.UserId,
                ActorId = actorId,
                Type = NotificationType.Like,
                PostId = postId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateFollowNotificationAsync(string actorId, string userId)
        {
            if (actorId == userId) return; // Don't notify if user follows themselves

            var notification = new Notification
            {
                UserId = userId,
                ActorId = actorId,
                Type = NotificationType.Follow,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCommentNotificationAsync(string actorId, int postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null || post.UserId == actorId) return; // Don't notify if post doesn't exist or user comments on their own post

            var notification = new Notification
            {
                UserId = post.UserId,
                ActorId = actorId,
                Type = NotificationType.Comment,
                PostId = postId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}