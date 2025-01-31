namespace FitCheck_Server.DTOs
{
    public class PostDtos
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public List<string> MediaUrls { get; set; } 
        public List<CommentDto> Comments { get; set; }
        public int LikeCount { get; set; }
    }

    public class CommentDto
    {
        public string Text { get; set; }
        public string AuthorUsername { get; set; } 
        public DateTime CreatedAt { get; set; }
    }

    public class HashtagDto
    {
        public string Tag { get; set; }
        public int PostCount { get; set; }
    }
}
