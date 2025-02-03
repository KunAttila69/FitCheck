using Microsoft.AspNetCore.Identity;

namespace FitCheck_Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Email {  get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
    }
}
