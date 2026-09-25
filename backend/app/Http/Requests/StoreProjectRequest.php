<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreProjectRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'long_description' => 'nullable|string',
            'tech_tags' => 'required|array|min:1',
            'tech_tags.*' => 'string|max:50',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'github_link' => 'nullable|url',
            'live_link' => 'nullable|url',
            'is_pinned' => 'boolean'
        ];
    }
}
