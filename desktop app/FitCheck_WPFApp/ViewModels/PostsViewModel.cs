using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class PostsViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;

        private ObservableCollection<Post> _posts;
        public ObservableCollection<Post> Posts
        {
            get => _posts;
            set => SetProperty(ref _posts, value);
        }

        private Post _selectedPost;
        public Post SelectedPost
        {
            get => _selectedPost;
            set => SetProperty(ref _selectedPost, value);
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }

        private string _searchQuery;
        public string SearchQuery
        {
            get => _searchQuery;
            set
            {
                if (SetProperty(ref _searchQuery, value))
                {
                    FilterPosts();
                }
            }
        }

        private string _removalReason;
        public string RemovalReason
        {
            get => _removalReason;
            set => SetProperty(ref _removalReason, value);
        }

        public ICommand RemovePostCommand { get; }
        public ICommand RefreshCommand { get; }

        public PostsViewModel(ApiService apiService, LogService logService)
        {
            _apiService = apiService;
            _logService = logService;
            _posts = new ObservableCollection<Post>();

            RemovePostCommand = new RelayCommand(async param => await RemovePostAsync(), param => SelectedPost != null);
            RefreshCommand = new RelayCommand(async param => await LoadPostsAsync());

            Task.Run(LoadPostsAsync);
        }

        private async Task LoadPostsAsync()
        {
            IsLoading = true;
            try
            {
                var posts = await _apiService.GetAllPostsAsync();
                Posts = new ObservableCollection<Post>(posts);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                // Log or handle the error
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task RemovePostAsync()
        {
            if (SelectedPost == null) return;

            try
            {
                await _apiService.RemovePostAsync(SelectedPost.Id, RemovalReason);
                await _logService.LogActionAsync(
                    AdminActionType.RemovePost,
                    "admin", // Replace with actual admin ID
                    "admin", // Replace with actual admin username
                    SelectedPost.Id.ToString(),
                    $"Post {SelectedPost.Id} by {SelectedPost.Username} was removed. Reason: {RemovalReason}"
                );

                Posts.Remove(SelectedPost);
                SelectedPost = null;
                RemovalReason = string.Empty;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                // Log or handle the error
            }
        }

        private void FilterPosts()
        {
            // Implementation would filter posts based on search query
        }
    }
}