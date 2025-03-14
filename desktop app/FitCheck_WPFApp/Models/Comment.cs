using System;

namespace FitCheck_WPFApp.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string AuthorId { get; set; }
        public string AuthorUsername { get; set; }
        public string AuthorProfilePicture { get; set; }
        public int PostId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}