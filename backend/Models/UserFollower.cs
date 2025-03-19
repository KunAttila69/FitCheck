using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitCheck_Server.Models
{
    public class UserFollower
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FollowerId { get; set; }

        [ForeignKey(nameof(FollowerId))]
        public ApplicationUser Follower { get; set; }

        [Required]
        public string FollowedId { get; set; }
        [ForeignKey(nameof(FollowedId))]
        public ApplicationUser Followed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}