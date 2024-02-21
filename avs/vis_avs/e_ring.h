#pragma once

#include "effect.h"
#include "effect_common.h"
#include "effect_info.h"

struct Ring_Color_Config : public Effect_Config {
    uint64_t color = 0x000000;
    Ring_Color_Config() = default;
    Ring_Color_Config(uint64_t color) : color(color){};
};

struct Ring_Config : public Effect_Config {
    int64_t position = HPOS_CENTER;
    int64_t size = 8;
    int64_t audio_source = AUDIO_WAVEFORM;
    int64_t audio_channel = AUDIO_CENTER;
    std::vector<Ring_Color_Config> colors;
    Ring_Config() { this->colors.emplace_back(0xffffff); }
};

struct Ring_Info : public Effect_Info {
    static constexpr char const* group = "Render";
    static constexpr char const* name = "Ring";
    static constexpr char const* help = "";
    static constexpr int32_t legacy_id = 14;
    static constexpr char const* legacy_ape_id = nullptr;

    static constexpr uint32_t num_color_params = 1;
    static constexpr Parameter color_params[num_color_params] = {
        P_COLOR(offsetof(Ring_Color_Config, color), "Color"),
    };

    static constexpr uint32_t num_parameters = 5;
    static constexpr Parameter parameters[num_parameters] = {
        P_SELECT(offsetof(Ring_Config, position), "Position", h_positions),
        P_IRANGE(offsetof(Ring_Config, size), "Size", 1, 64),
        P_SELECT(offsetof(Ring_Config, audio_source), "Audio Source", audio_sources),
        P_SELECT(offsetof(Ring_Config, audio_channel), "Audio Channel", audio_channels),
        P_LIST<Ring_Color_Config>(offsetof(Ring_Config, colors),
                                  "Colors",
                                  color_params,
                                  num_color_params,
                                  1,
                                  16),
    };

    EFFECT_INFO_GETTERS;
};

class E_Ring : public Configurable_Effect<Ring_Info, Ring_Config> {
   public:
    E_Ring(AVS_Instance* avs);
    virtual ~E_Ring() = default;
    virtual int render(char visdata[2][2][576],
                       int is_beat,
                       int* framebuffer,
                       int* fbout,
                       int w,
                       int h);
    virtual void load_legacy(unsigned char* data, int len);
    virtual int save_legacy(unsigned char* data);
    virtual E_Ring* clone() { return new E_Ring(*this); }

    uint32_t current_color_pos;
};
