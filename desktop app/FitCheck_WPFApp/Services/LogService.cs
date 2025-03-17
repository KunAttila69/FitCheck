using FitCheck_WPFApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace FitCheck_WPFApp.Services
{
    public class LogService
    {
        private readonly string _logFilePath = "admin_logs.json";
        private List<AdminLog> _logs;

        public LogService()
        {
            LoadLogs();
        }

        private void LoadLogs()
        {
            if (File.Exists(_logFilePath))
            {
                string json = File.ReadAllText(_logFilePath);
                _logs = JsonSerializer.Deserialize<List<AdminLog>>(json) ?? new List<AdminLog>();
            }
            else
            {
                _logs = new List<AdminLog>();
            }
        }

        private async Task SaveLogsAsync()
        {
            string json = JsonSerializer.Serialize(_logs);
            await File.WriteAllTextAsync(_logFilePath, json);
        }

        public async Task LogActionAsync(AdminActionType actionType, string adminId, string adminUsername, string targetId, string description)
        {
            var log = new AdminLog
            {
                Id = _logs.Count > 0 ? _logs.Max(l => l.Id) + 1 : 1,
                AdminId = adminId,
                AdminUsername = adminUsername,
                ActionType = actionType,
                TargetId = targetId,
                Description = description,
                Timestamp = DateTime.UtcNow
            };

            _logs.Add(log);
            await SaveLogsAsync();
        }

        public List<AdminLog> GetLogs()
        {
            return _logs.OrderByDescending(l => l.Timestamp).ToList();
        }

        internal async Task<IEnumerable<AdminLog>> GetLogsAsync(DateTime startDate, DateTime endDate)
        {
            throw new NotImplementedException();
        }
    }
}