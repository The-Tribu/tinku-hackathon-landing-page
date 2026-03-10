# Contract: robots.txt

**Served at**: `/robots.txt`  
**Content-Type**: `text/plain`

## Format

```
User-agent: *
Allow: /

# AI Crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Anthropic
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: https://DOMAIN/sitemap-index.xml
# LLM-optimized content
# llms.txt: https://DOMAIN/llms.txt
# llms-full.txt: https://DOMAIN/llms-full.txt
```

## Notes

- `DOMAIN` must be replaced with the actual deployed domain
- All AI crawlers are explicitly allowed per FR-026
- Sitemap reference uses Astro's auto-generated sitemap
