using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace FitCheck_WPFApp.Converters
{
    public class NullToVisibilityConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            bool invert = parameter != null && parameter.ToString().ToLower() == "inverse";
            bool isNull = value == null;

            if (invert)
                return isNull ? Visibility.Collapsed : Visibility.Visible;
            else
                return isNull ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            // Not implemented as we don't convert back from Visibility to null
            throw new NotImplementedException();
        }
    }
}