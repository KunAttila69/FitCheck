using FitCheck_WPFApp.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace FitCheck_WPFApp.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "http://localhost:5000/api"; // Update with your actual API URL

        public ApiService()
        {
            _httpClient = new HttpClient();
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
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/admin/users/{userId}/ban", banRequest);
            response.EnsureSuccessStatusCode();
        }

        public async Task UnbanUserAsync(string userId)
        {
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/admin/users/{userId}/ban");
            response.EnsureSuccessStatusCode();
        }

        // Posts Endpoints
        public async Task<List<Post>> GetAllPostsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/admin/posts?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Post>>();
        }

        public async Task RemovePostAsync(int postId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/admin/posts/{postId}");
            response.EnsureSuccessStatusCode();
        }

        // Comments Endpoints
        public async Task<List<Comment>> GetAllCommentsAsync(int page = 1, int pageSize = 25)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/admin/comments?page={page}&pageSize={pageSize}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Comment>>();
        }

        public async Task RemoveCommentAsync(int commentId, string reason)
        {
            var removeRequest = new
            {
                Reason = reason
            };
            var response = await _httpClient.DeleteAsync($"{_baseUrl}/admin/comments/{commentId}");
            response.EnsureSuccessStatusCode();
        }
    }
}