using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SeriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/series
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeriesResponse>>> GetSeries()
    {
        var series = await _context.Series
            .Include(series => series.Books)
            .OrderBy(series => series.Name)
            .Select(series => new SeriesResponse
            {
                Id = series.Id,
                Name = series.Name,
                Slug = series.Slug,
                Description = series.Description,
                CoverImage = series.CoverImage,
                BookCount = series.Books.Count
            })
            .ToListAsync();

        return Ok(series);
    }

    // GET: api/series/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<SeriesResponse>> GetSeriesBySlug(
        string slug)
    {
        var series = await _context.Series
            .Include(series => series.Books)
            .Where(series => series.Slug == slug)
            .Select(series => new SeriesResponse
            {
                Id = series.Id,
                Name = series.Name,
                Slug = series.Slug,
                Description = series.Description,
                CoverImage = series.CoverImage,
                BookCount = series.Books.Count
            })
            .FirstOrDefaultAsync();

        if (series == null)
        {
            return NotFound();
        }

        return Ok(series);
    }

    // POST: api/series
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<SeriesResponse>> CreateSeries(
        SeriesRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message = "Series name is required."
            });
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Name)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.Series
            .AnyAsync(series => series.Slug == slug);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "A series with this slug already exists."
            });
        }

        var series = new Series
        {
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description,
            CoverImage = request.CoverImage
        };

        _context.Series.Add(series);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetSeriesBySlug),
            new { slug = series.Slug },
            ToResponse(series)
        );
    }

    // PUT: api/series/{id}
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<SeriesResponse>> UpdateSeries(
        int id,
        SeriesRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message = "Series name is required."
            });
        }

        var series = await _context.Series
            .Include(series => series.Books)
            .FirstOrDefaultAsync(series => series.Id == id);

        if (series == null)
        {
            return NotFound();
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? GenerateSlug(request.Name)
            : request.Slug.Trim().ToLowerInvariant();

        var slugExists = await _context.Series
            .AnyAsync(existing =>
                existing.Slug == slug &&
                existing.Id != id);

        if (slugExists)
        {
            return Conflict(new
            {
                message = "A series with this slug already exists."
            });
        }

        series.Name = request.Name.Trim();
        series.Slug = slug;
        series.Description = request.Description;
        series.CoverImage = request.CoverImage;
        series.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ToResponse(series));
    }

    // DELETE: api/series/{id}
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSeries(int id)
    {
        var series = await _context.Series
            .Include(series => series.Books)
            .FirstOrDefaultAsync(series => series.Id == id);

        if (series == null)
        {
            return NotFound();
        }

        _context.Series.Remove(series);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static SeriesResponse ToResponse(Series series)
    {
        return new SeriesResponse
        {
            Id = series.Id,
            Name = series.Name,
            Slug = series.Slug,
            Description = series.Description,
            CoverImage = series.CoverImage,
            BookCount = series.Books.Count
        };
    }

    private static string GenerateSlug(string name)
    {
        return name
            .Trim()
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
    }
}

public class SeriesRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? CoverImage { get; set; }
}

public class SeriesResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImage { get; set; }
    public int BookCount { get; set; }
}