using System.ComponentModel.DataAnnotations;

namespace FitCheck_Server.DTOs
{
    public class UserBanRequest
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
    }
}