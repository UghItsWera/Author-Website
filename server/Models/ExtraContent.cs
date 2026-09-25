namespace server.Models;

public class ExtraContent
{
    public int Id { get; set; }

    public int? BookId { get; set; }

    public Book? Book { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Type { get; set; } = "Random Story";

    public string? Tags { get; set; }

    public string? Summary { get; set; }

    public string? Content { get; set; }

    public string? FeaturedImage { get; set; }

    public bool Published { get; set; } = false;

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}