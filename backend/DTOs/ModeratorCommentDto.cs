using System;

namespace FitCheck_Server.DTOs
{
    public class ModeratorCommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AuthorUsername { get; set; }
        public string AuthorProfilePicture { get; set; }
        public int PostId { get; set; }
    }
}