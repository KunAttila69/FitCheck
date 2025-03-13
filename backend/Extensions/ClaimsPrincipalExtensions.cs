using System.Security.Claims;

namespace FitCheck_Server.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public static string GetUserName(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Name);
        }

        public static string GetUserEmail(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Email);
        }

        public static bool IsInRole(this ClaimsPrincipal principal, string role)
        {
            return principal.HasClaim(ClaimTypes.Role, role);
        }

        public static bool IsAdmin(this ClaimsPrincipal principal)
        {
            return principal.IsInRole("Administrator");
        }

        public static bool IsModerator(this ClaimsPrincipal principal)
        {
            return principal.IsInRole("Moderator");
        }

        public static bool IsModeratorOrAdmin(this ClaimsPrincipal principal)
        {
            return principal.IsInRole("Moderator") || principal.IsInRole("Administrator");
        }
    }
}