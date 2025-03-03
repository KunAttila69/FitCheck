using Microsoft.AspNetCore.Identity;

namespace FitCheck_Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Email {  get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? Bio { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; } = null;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
