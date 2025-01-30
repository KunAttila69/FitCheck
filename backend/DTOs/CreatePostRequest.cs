using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace FitCheck_Server.DTOs
{
    public class CreatePostRequest
    {
        public string Caption { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}