using System;
using System.ComponentModel.DataAnnotations;

namespace FitCheck_Server.Models
{
    public enum NotificationType
    {
        Like,
        Follow,
        Comment
    }

    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string ActorId { get; set; }
        public ApplicationUser Actor { get; set; }

        public NotificationType Type { get; set; }

        public int? PostId { get; set; }
        public Post Post { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsRead { get; set; }
    }
}