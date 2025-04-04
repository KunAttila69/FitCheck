﻿using System;

namespace FitCheck_Server.DTOs
{
    public class ModeratorCommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AuthorUsername { get; set; }
        public string AuthorProfilePicture { get; set; }
        public int PostId { get; set; }
    }
    public class ModeratorPostDto
    {
        public int Id { get; set; }
        public string Caption { get; set; }
        public List<string>? MediaUrls { get; set; }
        public int LikeCount { get; set; }
        public int CommentCount { get; set; }
        public string? UserName { get; set; }
        public string? UserProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}