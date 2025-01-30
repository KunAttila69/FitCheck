using System.ComponentModel.DataAnnotations;

namespace FitCheck_Server.DTOs;
public class AddCommentRequest
{
    [Required]
    public string Text { get; set; }
}