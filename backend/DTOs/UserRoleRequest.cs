using System.ComponentModel.DataAnnotations;

namespace FitCheck_Server.DTOs
{
    public class UserRoleRequest
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string RoleName { get; set; } = string.Empty;
    }
}