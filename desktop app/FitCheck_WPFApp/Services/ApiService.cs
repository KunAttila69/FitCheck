using FitCheck_WPFApp.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace FitCheck_WPFApp.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "https://localhost:7293/api"; 

        public ApiService()
        {
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) =>
                {
                    return true;
                }
            };

            _httpClient = new HttpClient(handler);
            _httpClient.BaseAddress = new Uri(_baseUrl);
        }

        public void SetAuthToken(string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        // Users Endpoints
        public async Task<List<User>> GetAllUsersAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/admin/users");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<User>>();
        }

        public async Task BanUserAsync(string userId, DateTime? banUntil = null)
        {
            var banRequest = new
            {
                BannedUntil = banUntil
            };
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/admin/ban-user", banRequest);
            response.EnsureSuccessStatusCode();
        }

        public async Task UnbanUserAsync(string userId)
        {
            var response = await _httpClient.PostAsync($"{_baseUrl}/admin/unban-user/{userId}", null);
            response.EnsureSuccessStatusCode();
        }

        // Posts Endpoints
        public async Task<List<Post>> GetAllPostsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/moderator/posts?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Post>>();
        }

        public async Task RemovePostAsync(int postId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/moderator/posts/{postId}");
            response.EnsureSuccessStatusCode();
        }

        // Comments Endpoints
        public async Task<List<Comment>> GetAllCommentsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/moderator/comments?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Comment>>();
        }

        public async Task RemoveCommentAsync(int commentId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/moderator/comments/{commentId}");
            response.EnsureSuccessStatusCode();
        }
    }
}