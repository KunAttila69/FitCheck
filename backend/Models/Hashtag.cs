using FitCheck_Server.Models;
using System.ComponentModel.DataAnnotations;

public class Hashtag
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Tag { get; set; } 

    public List<Post> Posts { get; set; } = new List<Post>();
}