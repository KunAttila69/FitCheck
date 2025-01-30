// Models/Post.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitCheck_Server.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

        public string? Caption { get; set; }

        public List<PostMedia> MediaFiles { get; set; } = new List<PostMedia>();

        public List<Like> Likes { get; set; } = new List<Like>();
        public List<Comment> Comments { get; set; } = new List<Comment>();

        public List<Hashtag> Hashtags { get; set; } = new List<Hashtag>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public string? Location { get; set; }

        public PrivacySetting Privacy { get; set; } = PrivacySetting.Public;

        [Required]
        public string UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; }
    }

    public enum PrivacySetting
    {
        Public,
        FollowersOnly,
        Private
    }
}