using FitCheck_Server.Models;
using System;

namespace FitCheck_Server.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string ActorUsername { get; set; }
        public string ActorProfilePictureUrl { get; set; }
        public NotificationType Type { get; set; }
        public int? PostId { get; set; }
        public string PostThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}