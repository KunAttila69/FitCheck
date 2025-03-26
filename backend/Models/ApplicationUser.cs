using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitCheck_Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        //User properties
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? Bio { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; } = null;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Ban properties
        public bool IsBanned { get; set; } = false;
        public string? BanReason { get; set; }
        public DateTime? BannedAt { get; set; }

        //Follower properties
        [InverseProperty(nameof(UserFollower.Followed))]
        public virtual ICollection<UserFollower> Followers { get; set; } = new List<UserFollower>();

        [InverseProperty(nameof(UserFollower.Follower))]
        public virtual ICollection<UserFollower> Following { get; set; } = new List<UserFollower>();
    }
}