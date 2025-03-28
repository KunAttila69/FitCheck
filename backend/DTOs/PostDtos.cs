namespace FitCheck_Server.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public string? Caption { get; set; }
        public List<string>? MediaUrls { get; set; }
        public int LikeCount { get; set; }
        public string? UserName { get; set; }
        public string? UserProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsFromFollowedUser { get; set; }
        public bool IsLikedByCurrentUser { get; set; }
    }

    public class CommentDto
    {
        public string? Text { get; set; }
        public string? AuthorUsername { get; set; }
        public string? AuthorProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class HashtagDto
    {
        public string? Tag { get; set; }
        public int PostCount { get; set; }
    }
}
