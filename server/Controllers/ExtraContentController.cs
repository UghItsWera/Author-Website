using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExtraContentController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExtraContentController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/extracontent
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExtraContentResponse>>> GetExtraContent()
    {
        var content = await _context.ExtraContent
            .Include(item => item.Book)
            .OrderByDescending(item => item.CreatedAt)
            .Select(item => new ExtraContentResponse
            {
                Id = item.Id,
                BookId = item.BookId,
                BookTitle = item.Book != null
                    ? item.Book.Title
                    : null,
                Title = item.Title,
                Slug = item.Slug,
                Type = item.Type,
                Tags = item.Tags,
                Summary = item.Summary,
                Content = item.Content,
                FeaturedImage = item.FeaturedImage,
                Published = item.Published,
                PublishedAt = item.PublishedAt,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            })
            .ToListAsync();

        return Ok(content);
    }

    // GET: api/extracontent/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<ExtraContentResponse>> GetExtraContentBySlug(
        string slug)
    {
        var content = await _context.ExtraContent
            .Include(item => item.Book)
            .Where(item => item.Slug == slug)
            .Select(item => new ExtraContentResponse
            {
                Id = item.Id,
                BookId = item.BookId,
                BookTitle = item.Book != null
                    ? item.Book.Title
                    : null,
                Title = item.Title,
                Slug = item.Slug,
                Type = item.Type,
                Tags = item.Tags,
                Summary = item.Summary,
                Content = item.Content,
                FeaturedImage = item.FeaturedImage,
                Published = item.Published,
                PublishedAt = item.PublishedAt,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (content == null)
        {
            return NotFound();
        }

        return Ok(content);
    }

    // POST: api/extracontent
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ExtraContentResponse>> CreateExtraContent(
        ExtraContentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new
            {
                message = "Extra content title is required."
            });
        }

        if (RequiresBook(request.Type) && !request.BookId.HasValue)
        {
            return BadRequest(new
            {
                message = "A book is required for bonus chapters."
            });
        }

        if (request.BookId.HasValue)
        {
            var bookExists = await _context.Books
                .AnyAsync(book => book.Id == request.BookId.Value);

            if (!bookExists)
            {
                return BadRequest(new
                {
                    message = "The selected book does not exist."
                });
            }
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.ExtraContent
            .AnyAsync(item => item.Slug == slug);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "Extra content with this slug already exists."
            });
        }

        var extraContent = new ExtraContent
        {
            BookId = request.BookId,
            Title = request.Title.Trim(),
            Slug = slug,
            Type = string.IsNullOrWhiteSpace(request.Type)
                ? "Random Story"
                : request.Type.Trim(),
            Tags = request.Tags,
            Summary = request.Summary,
            Content = request.Content,
            FeaturedImage = request.FeaturedImage,
            Published = request.Published,
            PublishedAt = request.Published
                ? request.PublishedAt ?? DateTime.UtcNow
                : null
        };

        _context.ExtraContent.Add(extraContent);

        await _context.SaveChangesAsync();

        await _context.Entry(extraContent)
            .Reference(item => item.Book)
            .LoadAsync();

        return CreatedAtAction(
            nameof(GetExtraContentBySlug),
            new { slug = extraContent.Slug },
            ToResponse(extraContent)
        );
    }

    // PUT: api/extracontent/{id}
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ExtraContentResponse>> UpdateExtraContent(
        int id,
        ExtraContentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new
            {
                message = "Extra content title is required."
            });
        }

        if (RequiresBook(request.Type) && !request.BookId.HasValue)
        {
            return BadRequest(new
            {
                message = "A book is required for bonus chapters."
            });
        }

        var extraContent = await _context.ExtraContent
            .Include(item => item.Book)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (extraContent == null)
        {
            return NotFound();
        }

        if (request.BookId.HasValue)
        {
            var bookExists = await _context.Books
                .AnyAsync(book => book.Id == request.BookId.Value);

            if (!bookExists)
            {
                return BadRequest(new
                {
                    message = "The selected book does not exist."
                });
            }
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Title)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.ExtraContent
            .AnyAsync(existing =>
                existing.Slug == slug &&
                existing.Id != id);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "Extra content with this slug already exists."
            });
        }

        extraContent.BookId = request.BookId;
        extraContent.Title = request.Title.Trim();
        extraContent.Slug = slug;
        extraContent.Type = string.IsNullOrWhiteSpace(request.Type)
            ? "Random Story"
            : request.Type.Trim();
        extraContent.Tags = request.Tags;
        extraContent.Summary = request.Summary;
        extraContent.Content = request.Content;
        extraContent.FeaturedImage = request.FeaturedImage;
        extraContent.Published = request.Published;

        if (request.Published)
        {
            extraContent.PublishedAt =
                request.PublishedAt
                ?? extraContent.PublishedAt
                ?? DateTime.UtcNow;
        }
        else
        {
            extraContent.PublishedAt = null;
        }

        extraContent.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _context.Entry(extraContent)
            .Reference(item => item.Book)
            .LoadAsync();

        return Ok(ToResponse(extraContent));
    }

    // DELETE: api/extracontent/{id}
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteExtraContent(int id)
    {
        var extraContent = await _context.ExtraContent
            .FirstOrDefaultAsync(item => item.Id == id);

        if (extraContent == null)
        {
            return NotFound();
        }

        _context.ExtraContent.Remove(extraContent);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static ExtraContentResponse ToResponse(
        ExtraContent content)
    {
        return new ExtraContentResponse
        {
            Id = content.Id,
            BookId = content.BookId,
            BookTitle = content.Book?.Title,
            Title = content.Title,
            Slug = content.Slug,
            Type = content.Type,
            Tags = content.Tags,
            Summary = content.Summary,
            Content = content.Content,
            FeaturedImage = content.FeaturedImage,
            Published = content.Published,
            PublishedAt = content.PublishedAt,
            CreatedAt = content.CreatedAt,
            UpdatedAt = content.UpdatedAt
        };
    }

    private static bool RequiresBook(string? type)
    {
        return string.Equals(
            type,
            "Bonus Chapter",
            StringComparison.OrdinalIgnoreCase
        );
    }

    private static string GenerateSlug(string title)
    {
        return title
            .Trim()
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
    }
}

public class ExtraContentRequest
{
    public int? BookId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Slug { get; set; }

    public string Type { get; set; } = "Random Story";

    public string? Tags { get; set; }

    public string? Summary { get; set; }

    public string? Content { get; set; }

    public string? FeaturedImage { get; set; }

    public bool Published { get; set; }

    public DateTime? PublishedAt { get; set; }
}

public class ExtraContentResponse
{
    public int Id { get; set; }

    public int? BookId { get; set; }

    public string? BookTitle { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string? Tags { get; set; }

    public string? Summary { get; set; }

    public string? Content { get; set; }

    public string? FeaturedImage { get; set; }

    public bool Published { get; set; }

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}