using System;

namespace FitCheck_WPFApp.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsBanned { get; set; }
        public DateTime? BannedUntil { get; set; }
    }
}