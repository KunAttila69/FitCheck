using FitCheck_Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitCheck_Server.Data;
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Post> Posts { get; set; }
    public DbSet<PostMedia> PostMedia { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Hashtag> Hashtags { get; set; }

    public DbSet<UserFollower> UserFollowers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Add unique constraint to prevent duplicate follows
        builder.Entity<UserFollower>()
            .HasIndex(uf => new { uf.FollowerId, uf.FollowedId })
            .IsUnique();
    }
}