using System;
using System.Collections.Generic;

namespace FitCheck_WPFApp.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public List<string> MediaUrls { get; set; } = new List<string>();
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string UserProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}