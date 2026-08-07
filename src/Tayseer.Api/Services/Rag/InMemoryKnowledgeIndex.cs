using System.Collections.Immutable;

namespace Tayseer.Api.Services.Rag;


public sealed class InMemoryKnowledgeIndex
{
    private readonly object _gate = new();
    private ImmutableArray<IndexedKnowledgeChunk> _items = [];
    private DateTimeOffset? _builtAtUtc;
    private string? _lastError;

    public int Count
    {
        get
        {
            lock (_gate)
            {
                return _items.Length;
            }
        }
    }

    public DateTimeOffset? BuiltAtUtc
    {
        get
        {
            lock (_gate)
            {
                return _builtAtUtc;
            }
        }
    }

    public string? LastError
    {
        get
        {
            lock (_gate)
            {
                return _lastError;
            }
        }
    }

    public void ReplaceAll(IEnumerable<IndexedKnowledgeChunk> items, DateTimeOffset builtAtUtc)
    {
        lock (_gate)
        {
            _items = items.ToImmutableArray();
            _builtAtUtc = builtAtUtc;
            _lastError = null;
        }
    }

    public void SetError(string error)
    {
        lock (_gate)
        {
            _lastError = error;
        }
    }

    public ImmutableArray<IndexedKnowledgeChunk> Snapshot()
    {
        lock (_gate)
        {
            return _items;
        }
    }
}
