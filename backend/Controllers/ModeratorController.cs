﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitCheck_Server.Data;
using FitCheck_Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/moderator")]
    [Authorize(Policy = "RequireModeratorOrAdmin")]
    public class ModeratorController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public ModeratorController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _dbContext.Posts
                .Include(p => p.User)
                .Include(p => p.MediaFiles)
                .Include(p => p.Hashtags)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpDelete("posts/{postId}")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var post = await _dbContext.Posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound(new { Message = "Post not found" });
            }

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Post deleted successfully" });
        }

        [HttpGet("comments")]
        public async Task<IActionResult> GetAllComments()
        {
            var comments = await _dbContext.Comments
                .Include(c => c.User)
                .Include(c => c.Post)
                .ToListAsync();

            return Ok(comments);
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _dbContext.Comments.FindAsync(commentId);
            if (comment == null)
            {
                return NotFound(new { Message = "Comment not found" });
            }

            _dbContext.Comments.Remove(comment);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Comment deleted successfully" });
        }
    }
}