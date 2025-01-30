using FitCheck_Server.DTOs;
using FitCheck_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;
using FitCheck_Server.Models;
using FitCheck_Server.Data;

namespace FitCheck_Server.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly FileService _fileService;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostsController(
            ApplicationDbContext context,
            FileService fileService,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _fileService = fileService;
            _userManager = userManager;
        }

        #region Post Endpoints
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Unauthorized();

            var mediaFiles = new List<PostMedia>();
            foreach (var file in request.Files)
            {
                var filePath = await _fileService.SaveMediaAsync(file);
                mediaFiles.Add(new PostMedia
                {
                    FilePath = filePath,
                    Type = file.ContentType.StartsWith("image/") ? MediaType.Image : MediaType.Video
                });
            }

            var hashtags = ExtractHashtags(request.Caption);

            var post = new Post
            {
                Caption = request.Caption,
                MediaFiles = mediaFiles,
                Hashtags = hashtags,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        [HttpGet]
        public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.MediaFiles)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPost(int postId)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.MediaFiles)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null) return NotFound();

            return Ok(post);
        }
        #endregion

        #region Like Endpoints
        [HttpPost("{postId}/likes")]
        [Authorize]
        public async Task<IActionResult> LikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (existingLike != null) return BadRequest("Post already liked.");

            var like = new Like { PostId = postId, UserId = userId };
            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{postId}/likes")]
        [Authorize]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var like = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (like == null) return NotFound();

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion

        #region Comment Endpoints
        [HttpPost("{postId}/comments")]
        [Authorize]
        public async Task<IActionResult> AddComment(int postId, [FromBody] AddCommentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var comment = new Comment
            {
                Text = request.Text,
                PostId = postId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        [HttpGet("{postId}/comments")]
        public async Task<IActionResult> GetComments(int postId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments);
        }
        #endregion

        #region Hashtag Endpoints
        [HttpGet("hashtags/trending")]
        public async Task<IActionResult> GetTrendingHashtags([FromQuery] int count = 10)
        {
            var hashtags = await _context.Hashtags
                .OrderByDescending(h => h.Posts.Count)
                .Take(count)
                .ToListAsync();

            return Ok(hashtags);
        }
        #endregion

        #region Helper Methods
        private List<Hashtag> ExtractHashtags(string caption)
        {
            var hashtags = new List<Hashtag>();
            var matches = Regex.Matches(caption, @"#\w+");

            foreach (Match match in matches)
            {
                var tag = match.Value.TrimStart('#');
                var existingTag = _context.Hashtags.FirstOrDefault(h => h.Tag == tag);

                if (existingTag == null)
                {
                    existingTag = new Hashtag { Tag = tag };
                    _context.Hashtags.Add(existingTag);
                }

                hashtags.Add(existingTag);
            }

            return hashtags;
        }
        #endregion
    }
}