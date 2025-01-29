using FitCheck_Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Like
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public ApplicationUser User { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; }
}