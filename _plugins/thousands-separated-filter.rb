module ThousandsSeparatedFilter
    def thousands_separated(input, separator=",")
        input.to_s.gsub(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1#{separator}")
    end
end

Liquid::Template.register_filter(ThousandsSeparatedFilter)
