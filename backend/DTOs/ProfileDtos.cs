using System.ComponentModel.DataAnnotations;

namespace FitCheck_Server.DTOs
{
    public class ProfileDto
    {
        public string Username { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }
        public int LikesCount { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public string Id { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? Username { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? Bio { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
