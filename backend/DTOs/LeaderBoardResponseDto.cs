using System.Collections.Generic;

namespace FitCheck_Server.DTOs
{
    public class LeaderboardResponseDto
    {
        public List<UserRankDto> TopUsers { get; set; } = new List<UserRankDto>();
        public UserRankDto CurrentUserRank { get; set; }
    }
}