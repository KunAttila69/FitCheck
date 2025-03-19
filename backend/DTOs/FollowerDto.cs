using System;

namespace FitCheck_Server.DTOs
{
    public class FollowerDto
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string ProfilePictureUrl { get; set; }
        public DateTime FollowedSince { get; set; }
    }

    public class FollowStats
    {
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
    }
}