using System;

namespace FitCheck_WPFApp.Models
{
    public enum AdminActionType
    {
        BanUser,
        UnbanUser,
        RemovePost,
        RemoveComment,
        Login,
        Logout,
        UnauthorizedAccess,
        ModifyUserRole
    }

    public class AdminLog
    {
        public int Id { get; set; }
        public string AdminId { get; set; }
        public string AdminUsername { get; set; }
        public AdminActionType ActionType { get; set; }
        public string TargetId { get; set; }
        public string Description { get; set; }
        public DateTime Timestamp { get; set; }
    }
}