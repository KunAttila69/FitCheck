using FitCheck_WPFApp.Models;
using FitCheck_WPFApp.Services;
using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace FitCheck_WPFApp.ViewModels
{
    public class CommentsViewModel : ViewModelBase
    {
        private readonly ApiService _apiService;
        private readonly LogService _logService;
        private readonly AuthService _authService;
        private readonly string _baseRootUrl = "https://localhost:7293";


        private ObservableCollection<Comment> _comments;
        public ObservableCollection<Comment> Comments
        {
            get => _comments;
            set => SetProperty(ref _comments, value);
        }

        private Comment _selectedComment;
        public Comment SelectedComment
        {
            get => _selectedComment;
            set => SetProperty(ref _selectedComment, value);
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
                    FilterComments();
                }
            }
        }

        private string _removalReason;
        public string RemovalReason
        {
            get => _removalReason;
            set => SetProperty(ref _removalReason, value);
        }

        public ICommand RemoveCommentCommand { get; }
        public ICommand RefreshCommand { get; }

        public CommentsViewModel(ApiService apiService, LogService logService, AuthService authService)
        {
            _apiService = apiService;
            _logService = logService;
            _authService = authService;
            _comments = new ObservableCollection<Comment>();

            RemoveCommentCommand = new RelayCommand(
                async param => await RemoveCommentAsync(),
                param => SelectedComment != null && !string.IsNullOrWhiteSpace(RemovalReason)
            );

            RefreshCommand = new RelayCommand(async param => await LoadCommentsAsync());

            Task.Run(LoadCommentsAsync);
        }

        private async Task LoadCommentsAsync()
        {
            IsLoading = true;
            try
            {
                var comments = await _apiService.GetAllCommentsAsync();
                foreach (var c in comments)
                {
                    if (c.AuthorProfilePicture != null)
                    {
                        c.AuthorProfilePicture = _baseRootUrl + c.AuthorProfilePicture;
                    }
                    else
                    {
                        c.AuthorProfilePicture = @"Resources\default_user.png";
                    }
                }
                Comments = new ObservableCollection<Comment>(comments);
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

        private async Task RemoveCommentAsync()
        {
            if (SelectedComment == null || string.IsNullOrWhiteSpace(RemovalReason))
                return;

            try
            {
                await _apiService.RemoveCommentAsync(SelectedComment.Id, RemovalReason);
                await _logService.LogActionAsync(
                    AdminActionType.RemoveComment,
                    _authService.GetCurrentUsername(),
                    _authService.GetCurrentUsername(),
                    SelectedComment.Id.ToString(),
                    $"Comment removed. Reason: {RemovalReason}"
                );

                // Remove the comment from the list
                Comments.Remove(SelectedComment);
                SelectedComment = null;
                RemovalReason = string.Empty;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void FilterComments()
        {
            // Implement comment filtering based on search query
            if (string.IsNullOrWhiteSpace(SearchQuery))
            {
                // If search query is empty, reload all comments
                Task.Run(LoadCommentsAsync);
                return;
            }

            // Filter the in-memory collection (could be enhanced with API filtering)
            string searchLower = SearchQuery.ToLower();
            ObservableCollection<Comment> filteredComments = new ObservableCollection<Comment>();

            foreach (Comment comment in Comments)
            {
                if ((comment.Text != null && comment.Text.ToLower().Contains(searchLower)) ||
                    (comment.AuthorUsername != null && comment.AuthorUsername.ToLower().Contains(searchLower)))
                {
                    filteredComments.Add(comment);
                }
            }

            Comments = filteredComments;
        }
    }
}