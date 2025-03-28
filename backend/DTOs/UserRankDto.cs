using System;

namespace FitCheck_Server.DTOs
{
    public class UserRankDto
    {
        public int Rank { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int LikeCount { get; set; }
    }
}