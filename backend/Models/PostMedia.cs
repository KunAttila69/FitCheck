using FitCheck_Server.Models;
using System.ComponentModel.DataAnnotations;

public class PostMedia
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string FilePath { get; set; } 
    public MediaType Type { get; set; } 

    public int PostId { get; set; }
    public Post Post { get; set; }
}

public enum MediaType
{
    Image,
    Video
}