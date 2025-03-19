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
        private readonly AuthService _authService;

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

        private int _currentPage = 1;
        public int CurrentPage
        {
            get => _currentPage;
            set => SetProperty(ref _currentPage, value);
        }

        private int _pageSize = 25;
        public int PageSize
        {
            get => _pageSize;
            set => SetProperty(ref _pageSize, value);
        }

        public ICommand RemovePostCommand { get; }
        public ICommand RefreshCommand { get; }
        public ICommand NextPageCommand { get; }
        public ICommand PreviousPageCommand { get; }

        public PostsViewModel(ApiService apiService, LogService logService, AuthService authService)
        {
            _apiService = apiService;
            _logService = logService;
            _authService = authService;
            _posts = new ObservableCollection<Post>();

            RemovePostCommand = new RelayCommand(
                async param => await RemovePostAsync(),
                param => SelectedPost != null && !string.IsNullOrWhiteSpace(RemovalReason)
            );
            RefreshCommand = new RelayCommand(async param => await LoadPostsAsync());
            NextPageCommand = new RelayCommand(
                param => { CurrentPage++; Task.Run(LoadPostsAsync); },
                param => !IsLoading && Posts.Count == PageSize
            );
            PreviousPageCommand = new RelayCommand(
                param => { if (CurrentPage > 1) { CurrentPage--; Task.Run(LoadPostsAsync); } },
                param => !IsLoading && CurrentPage > 1
            );

            Task.Run(LoadPostsAsync);
        }

        private async Task LoadPostsAsync()
        {
            IsLoading = true;
            try
            {
                var posts = await _apiService.GetAllPostsAsync(CurrentPage, PageSize);
                Posts = new ObservableCollection<Post>(posts);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task RemovePostAsync()
        {
            if (SelectedPost == null || string.IsNullOrWhiteSpace(RemovalReason))
                return;

            try
            {
                await _apiService.RemovePostAsync(SelectedPost.Id, RemovalReason);
                await _logService.LogActionAsync(
                    AdminActionType.RemovePost,
                    _authService.GetCurrentUsername(),
                    _authService.GetCurrentUsername(),
                    SelectedPost.Id.ToString(),
                    $"Post removed. Reason: {RemovalReason}"
                );

                // Remove from the list
                Posts.Remove(SelectedPost);
                SelectedPost = null;
                RemovalReason = string.Empty;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void FilterPosts()
        {
            // Reset to first page when filtering
            CurrentPage = 1;

            if (string.IsNullOrWhiteSpace(SearchQuery))
            {
                // If search query is empty, load all posts
                Task.Run(LoadPostsAsync);
                return;
            }

            // Implement client-side filtering
            var searchLower = SearchQuery.ToLower();
            var filteredPosts = new ObservableCollection<Post>();

            foreach (var post in Posts)
            {
                if ((post.Caption != null && post.Caption.ToLower().Contains(searchLower)) ||
                    (post.Username != null && post.Username.ToLower().Contains(searchLower)))
                {
                    filteredPosts.Add(post);
                }
            }

            Posts = filteredPosts;
        }
    }
}